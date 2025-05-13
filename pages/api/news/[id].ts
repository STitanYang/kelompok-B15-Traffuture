// pages/api/news/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db("berita_db");
    const newsItem = await db
      .collection("news")
      .findOne({ _id: new ObjectId(id as string) });

    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({
      _id: newsItem._id.toString(),
      title: newsItem.title,
      content: newsItem.content,
      imageBase64: newsItem.imageBase64,
    });
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
