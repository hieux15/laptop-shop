import { NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/upload';

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

    // Đọc nội dung file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload lên Supabase Storage
    const result = await uploadToSupabase(buffer, 'products', file.name, file.type);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl: result.imageUrl, fileName: result.fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi upload ảnh' }, { status: 500 });
  }
}