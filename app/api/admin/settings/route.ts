import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

async function getCurrentPassword(): Promise<string> {
  try {
    const content = await readFile(ENV_PATH, "utf-8");
    const match = content.match(/^ADMIN_PASSWORD=(.*)$/m);
    return match ? match[1] : "123456";
  } catch {
    return "123456";
  }
}

async function setPassword(newPassword: string) {
  try {
    const content = await readFile(ENV_PATH, "utf-8");
    const lines = content.split("\n");
    let found = false;

    const updatedLines = lines.map((line) => {
      if (line.startsWith("ADMIN_PASSWORD=")) {
        found = true;
        return `ADMIN_PASSWORD=${newPassword}`;
      }
      return line;
    });

    if (!found) {
      updatedLines.push(`ADMIN_PASSWORD=${newPassword}`);
    }

    await writeFile(ENV_PATH, updatedLines.join("\n"), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    const current = await getCurrentPassword();

    if (currentPassword !== current) {
      return NextResponse.json(
        { error: "当前密码错误" },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { error: "新密码长度至少4位" },
        { status: 400 }
      );
    }

    const success = await setPassword(newPassword);

    if (!success) {
      return NextResponse.json(
        { error: "保存失败，请确保 .env.local 文件可写" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}