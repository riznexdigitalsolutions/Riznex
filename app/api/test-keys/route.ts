import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const valFile = path.join(process.cwd(), 'public', 'uploads', 'debug_gemini_val.txt');
    const errFile = path.join(process.cwd(), 'public', 'uploads', 'debug_gemini.txt');
    let valData = 'No val file';
    let errData = 'No err file';
    if (fs.existsSync(valFile)) valData = fs.readFileSync(valFile, 'utf8');
    if (fs.existsSync(errFile)) errData = fs.readFileSync(errFile, 'utf8');
    return NextResponse.json({ valData, errData });
  } catch(e: any) {
    return NextResponse.json({ error: e.message });
  }
}
