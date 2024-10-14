//TODO 1 : dapatkan semua data
//TODO 2 : dapatkan data dengan nama tertentu
//TODO 3 : dapatkan data dengan alamat New York
//TODO 4 : dapatkan data dengan umur >= 30

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Laptop {
  id: number;
  name: string;
  type: string;
  description: string;
  price: number;
}

const getData = (): Laptop[] => {
  const filePath = path.join(process.cwd(), 'public/data/laptops.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData) as Laptop[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const ram = searchParams.get('ram');

  let data: Laptop[] = getData();

  if (brand) {
    data = data.filter((item: Laptop) =>
      item.name.toLowerCase().includes(brand.toLowerCase())
    );
  }

  if (minPrice || maxPrice) {
    const min = minPrice ? parseInt(minPrice, 10) : 0;
    const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
    data = data.filter((item: Laptop) => item.price >= min && item.price <= max);
  }

  if (ram) {
    const ramValue = parseInt(ram, 10);
    data = data.filter((item: Laptop) => {
      const ramInDescription = item.description.match(/(\d+)GB RAM/);
      if (ramInDescription) {
        const ramInLaptop = parseInt(ramInDescription[1], 10);
        return ramInLaptop === ramValue;
      }
      return false;
    });
  }

  return NextResponse.json(data);
}
