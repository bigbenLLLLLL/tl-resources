import type { Application } from 'express';
import express from 'express';

export function applyParsers(app: Application) {
  // JSON and urlencoded body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
