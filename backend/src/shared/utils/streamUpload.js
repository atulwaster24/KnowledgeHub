import Busboy from "busboy";
import { logger } from "../../config/logger.js";

import { supabase } from "../storage/supabase.js";
import { AppError } from "../errors/AppError.js";

import { v4 as uuid } from "uuid";
import { env } from "../../config/env.js";

const MAX_SIZE = Number(env.MAX_FILE_SIZE || 10) * 1024 * 1024;

export const streamPdfUpload = (req) =>
  new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: MAX_SIZE },
    });

    let uploadPromise = null;
    let fileKey = null;
    let settled = false;
    let fields = {};

    const fail = (err) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    };

    const succeed = (data) => {
      if (!settled) {
        settled = true;
        resolve(data);
      }
    };

    if (uploadPromise) {
      file.resume();
      return fail(new AppError("Only one file is allowed", 400));
    }

    busboy.on("filesLimit", () => {
        fail(new AppError('File too large', 413));
    })

    busboy.on("file", (fieldname, file, info) => {
      const { mimeType } = info;

      if (mimeType !== "application/pdf") {
        file.resume();
        return fail(new AppError("Only PDF files are allowed", 400));
      }

      fileKey = `pdfs/${uuid()}.pdf`;

      if(process.env.SUPABASE_BUCKET){
        throw new Error("SUPABASE_BUCKET not configured correctly.");
      }

      uploadPromise = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileKey, file, {
          contentType: mimeType,
          upsert: false,
        });
    });

    busboy.on("field", (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on("finish", async () => {
      if (!uploadPromise) {
        return fail(new AppError("No file provided", 400));
      }

      const { error } = await uploadPromise;

      if (error) {
        logger.error("Supabase storage upload failed", {
          bucket: process.env.SUPABASE_BUCKET,
          fileKey,
          supabaseError: error,
        });

        return fail(new AppError("File upload failed", 500));
      }

      // SUCCESS PATH
      return succeed({
        fileKey,
        fields,
      });
    });

    busboy.on("error", fail);
    req.pipe(busboy);
  });
