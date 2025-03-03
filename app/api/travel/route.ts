import { Departure } from "@/app/interfaces/departure";
import { NextResponse } from "next/server";
import {
  createTravel,
  deleteTravel,
  editTravel,
  getAllTravels,
  getTravel,
} from "./service";
import sharp from "sharp";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const travel = await getTravel(Number(id));

      if (!travel) {
        return NextResponse.json(
          { error: "Travel not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(travel, { status: 200 });
    }

    const travels = await getAllTravels();
    return NextResponse.json(travels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const travel = {
      title: formData.get("title") as string,
      location: formData.get("destination") as string,
      date: new Date(formData.get("date") as string),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      number_of_seats: parseInt(formData.get("seats") as string),
      duration: parseInt(formData.get("duration") as string),
    };

    const departures: Departure[] = JSON.parse(
      formData.get("departures") as string
    );

    let images: File[] = [];
    const imgs: File[] = formData.getAll("images[]") as File[];

    images = await Promise.all(
      imgs.map(async (file) => {
        if (file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          const compressedBuffer = await sharp(Buffer.from(arrayBuffer))
            .resize(1024)
            .jpeg({ quality: 90 })
            .toBuffer();

          return new File([compressedBuffer], file.name, {
            type: "image/jpeg"
          });
        }
        return file;
      })
    );

    const newTravel = await createTravel(travel, departures, images);

    return NextResponse.json(newTravel, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const travel = {
      id: parseInt(formData.get("id") as string),
      title: formData.get("title") as string,
      location: formData.get("destination") as string,
      date: new Date(formData.get("date") as string),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      number_of_seats: parseInt(formData.get("seats") as string),
      duration: parseInt(formData.get("duration") as string),
    };

    const departuresJson = formData.get("departures") as string;
    const departures: Departure[] = departuresJson
      ? JSON.parse(departuresJson)
      : [];

    const deletedDeparturesJson = formData.get("deletedDepartures[]") as string;
    const deletedDepartures: number[] = deletedDeparturesJson
      ? JSON.parse(deletedDeparturesJson)
      : [];

    const images: File[] = [];
    if (formData.getAll("images[]"))
      formData.getAll("images[]").forEach((file) => {
        if (file instanceof File) {
          images.push(file);
        }
      });
    const deletedImagesJson = formData.get("deletedImages[]");
    const deletedImages: string[] = deletedImagesJson
      ? JSON.parse(deletedImagesJson as string)
      : [];

    const isEdited = await editTravel(
      travel,
      departures,
      deletedDepartures,
      images,
      deletedImages
    );

    return NextResponse.json(isEdited, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing travel id" }, { status: 400 });
    }
    const deletedTravel = await deleteTravel(Number(id));
    return NextResponse.json({ deletedTravel }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
