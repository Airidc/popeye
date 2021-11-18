import { Router } from "express";

export interface BasicController {
  path: string;
  router: Router;
}
