import express from "express";
import { Server } from "http";
import * as socketio from "socket.io";
import { connect } from "mongoose";
import * as fs from "fs/promises";
import path from "path";
import { BasicController, BasicSocketController, GeoFeatureCollection, GeoLine } from "./interface";
import errorMiddleware from "./middleware/error.middleware";
import { GeoLineModel } from "./models/geo-data";

export default class App {
  public app: express.Application;
  public port: number;
  public server: Server;
  public io: socketio.Server;

  constructor(controllers: BasicController[], socketControllers: BasicSocketController[], port: number) {
    this.app = express();
    this.port = port || 5000;
    this.app.set("port", this.port);

    this.server = new Server(this.app);
    this.io = new socketio.Server();
    this.io.attach(this.server);

    this.initializeMiddlewares();
    this.initializeControllers(this.io, controllers, socketControllers);
    this.initializeErrorHandling();
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private async initializeDbConnection() {
    try {
      await connect(<string>process.env.MONGO_URI, {});
      await this.seedDatabase();
      console.log("Connected to the database");
    } catch (error) {
      console.log("Unable to connect to db", error);
      process.exit(1);
    }
  }

  private async seedDatabase() {
    let officeRouteRaw = await fs.readFile(path.resolve(__dirname, "../popeye-village-balluta.geojson"), "utf8");
    let lunchRouteRaw = await fs.readFile(path.resolve(__dirname, "../lunch.geojson"), "utf8");

    const result = await GeoLineModel.find();
    if (result.length >= 3) {
      console.log("skipping seeding data");
      return;
    }
    const officeRouteJSON = JSON.parse(officeRouteRaw) as GeoFeatureCollection;
    const homeToOficeGeo = officeRouteJSON.features[0].geometry;
    homeToOficeGeo.route = "Home to Work";
    const officeToDB = new GeoLineModel(homeToOficeGeo);
    officeToDB.save();

    const officeToHome = homeToOficeGeo;
    officeToHome.route = "Work to Home";

    // Reverse coordinates for Work -> Home route
    let arrayLength = homeToOficeGeo.coordinates.length - 1;
    officeToHome.coordinates = homeToOficeGeo.coordinates.reduce((ac: any, c: any, i: number) => {
      ac[arrayLength - i] = c;
      return ac;
    }, []);
    const officeToHomeToDB = new GeoLineModel(officeToHome);
    officeToHomeToDB.save();

    const lunchRouteJSON = JSON.parse(lunchRouteRaw) as GeoFeatureCollection;
    const lunchGeo = lunchRouteJSON.features[0].geometry;
    lunchGeo.route = "Lunch";
    const lunchRouteToDB = new GeoLineModel(lunchGeo);
    lunchRouteToDB.save();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeControllers(
    ioServer: socketio.Server,
    controllers: BasicController[],
    socketControllers: BasicSocketController[]
  ) {
    controllers.forEach((controller: BasicController) => {
      this.app.use("/api", controller.router);
    });

    this.io.on("connection", (socket: socketio.Socket) => {
      socket.emit("Connection to socket established");

      socketControllers.forEach((controller: BasicSocketController) => {
        controller.registerEvents(socket);
      });
    });
  }

  public async listen() {
    try {
      await this.initializeDbConnection();

      this.server.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`);
      });
    } catch (error: any) {
      console.error(`Error occured: ${error.message}`);
    }
  }
}

const port = parseInt(<string>process.env.PORT) || 5000;
const app = new App([], [], port);

app.listen();

// export default class App {
//   public app: express.Application;
//   public port: number;

//   constructor(controllers: BasicController[], port: number) {
//     this.app = express();
//     this.port = port || 5000;

//     this.initializeMiddlewares();
//     this.initializeControllers(controllers);
//     this.initializeErrorHandling();
//   }

//   private initializeErrorHandling() {
//     this.app.use(errorMiddleware);
//   }

//   private async initializeDbConnection() {
//     try {
//       await new Mongoose().connect(<string>process.env.MONGO_URI);
//       console.log("Connected to the database");
//     } catch (error) {
//       console.log("Unable to connect to db", error);
//       process.exit(1);
//     }
//   }

//   private initializeMiddlewares() {
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: true }));
//     this.app.use(cors({ origin: "*" })); // allow all just for now
//   }

//   private initializeControllers(controllers: BasicController[]) {
//     controllers.forEach((controller: BasicController) => {
//       this.app.use("/api", controller.router);
//     });
//   }

//   private initSocket() {
//     const io = new Server(this.app, {
//       /* options */
//     });

//     io.on("connection", (socket) => {
//       // ...
//     });
//   }

//   public async listen() {
//     try {
//       await this.initializeDbConnection();
//       this.app.listen(this.port, () => {
//         console.log(`App listening on the port ${this.port}`);
//       });
//     } catch (error: any) {
//       console.error(`Error occured: ${error.message}`);
//     }
//   }
// }
