import { School } from "../model/school.model";
import express from "express";

type data = {
    schoolName: string,
    schoolLocation: string[]
}

const addSchool = async (req: express.Request, res: express.Response) => {
  const data = req.body as data;
  console.log(req.body);
  if (data.schoolLocation) {
    try {
      const school = new School(data);
      await school.save();
      return res.json({ success: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        return res.json({ success: false, message: err.message });
      }
      return res.json({ success: false, message: 'Erreur inconnue' });
    }
  } else {
    return res.json({ success: false, message: 'schoolLocation manquant' });
  }
}

export {addSchool}