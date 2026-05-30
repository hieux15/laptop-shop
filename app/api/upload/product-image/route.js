import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không có file nào được chọn' }, { status: 400 });
    }

    // Kiểm tra định dạng file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF, AVIF)'
      }, { status: 400 });
    }

    // Kiểm tra kích thước file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File ảnh không được vượt quá 5MB'
      }, { status: 400 });
    }

    // Tạo tên file duy nhất
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${baseName}-${timestamp}-${random}${ext}`;

    // Đảm bảo thư mục public/products tồn tại
    const uploadDir = path.join(process.cwd(), 'public', 'products');
    await mkdir(uploadDir, { recursive: true });

    // Ghi file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Trả về đường dẫn tương đối để lưu vào DB
    const imageUrl = `/products/${fileName}`;

    return NextResponse.json({ success: true, imageUrl, fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi upload ảnh' }, { status: 500 });
  }
}