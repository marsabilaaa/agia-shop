'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    // Validasi tipe
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('Format file harus JPG, PNG, atau WebP')
      return
    }

    // Preview lokal dulu
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    try {
      // Buat nama file unik
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Ambil public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      onChange(data.publicUrl)
      toast.success('Gambar berhasil diupload')
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengupload gambar')
      setPreview(value) // rollback preview
    } finally {
      setUploading(false)
      // Reset input supaya file yang sama bisa diupload ulang
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-slate-50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay saat uploading */}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
          {/* Tombol hapus */}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors',
            'border-slate-200 hover:border-slate-400 hover:bg-slate-50',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ImagePlus className="h-8 w-8 text-slate-300" />
          <span className="text-sm text-slate-400">
            Klik untuk upload gambar
          </span>
          <span className="text-xs text-slate-300">
            JPG, PNG, WebP — maks. 5MB
          </span>
        </button>
      )}

      {/* Tombol ganti gambar (jika sudah ada preview) */}
      {preview && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-3 w-3 mr-2" />
          Ganti Gambar
        </Button>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  )
}