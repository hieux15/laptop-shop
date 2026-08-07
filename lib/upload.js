import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET_NAME = 'images';

// Khởi tạo Supabase client với service role key (chỉ dùng server-side)
function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Upload file lên Supabase Storage
 * @param {Buffer} buffer - Nội dung file
 * @param {string} folder - Thư mục trong bucket (vd: 'products', 'brands')
 * @param {string} fileName - Tên file gốc (để lấy extension)
 * @param {string} contentType - MIME type của file
 * @returns {Promise<{ success: boolean, imageUrl?: string, error?: string }>}
 */
export async function uploadToSupabase(buffer, folder, fileName, contentType) {
  try {
    const supabase = getSupabaseAdmin();

    // Tạo tên file duy nhất
    const ext = fileName.includes('.') ? fileName.split('.').pop() : '';
    const baseName = fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const uniqueName = `${baseName}-${timestamp}-${random}.${ext}`;
    const filePath = `${folder}/${uniqueName}`;

    // Upload lên bucket
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return { success: false, error: error.message || 'Lỗi khi upload lên cloud storage' };
    }

    // Lấy public URL
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    return { success: true, imageUrl, fileName: uniqueName };
  } catch (error) {
    console.error('Upload to Supabase error:', error);
    return { success: false, error: 'Lỗi khi upload lên cloud storage' };
  }
}

/**
 * Xóa file khỏi Supabase Storage từ public URL
 * @param {string} publicUrl - URL công khai của file
 * @returns {Promise<boolean>} - true nếu xóa thành công
 */
export async function deleteFromSupabase(publicUrl) {
  try {
    if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/')) {
      return false;
    }

    const supabase = getSupabaseAdmin();

    // Trích xuất path từ URL: .../object/public/images/products/file.jpg
    const urlObj = new URL(publicUrl);
    const pathParts = urlObj.pathname.split('/');
    // pathParts = ['', 'storage', 'v1', 'object', 'public', 'images', 'products', 'file.jpg']
    const bucketIndex = pathParts.indexOf('public') + 1;
    if (bucketIndex < 0 || bucketIndex >= pathParts.length) return false;

    const bucket = pathParts[bucketIndex];
    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    if (bucket !== BUCKET_NAME) return false;

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Delete from Supabase error:', error);
    return false;
  }
}