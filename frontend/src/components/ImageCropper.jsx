import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { FaSearchPlus, FaSearchMinus, FaCrop, FaTimes } from 'react-icons/fa'

const MAX_OUTPUT_WIDTH = 1600
const JPEG_QUALITY = 0.82

function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const scale = pixelCrop.width > MAX_OUTPUT_WIDTH ? MAX_OUTPUT_WIDTH / pixelCrop.width : 1
      const outW = Math.round(pixelCrop.width * scale)
      const outH = Math.round(pixelCrop.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outW,
        outH
      )

      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', JPEG_QUALITY)
    }
    image.src = imageSrc
  })
}

export default function ImageCropper({ imageSrc, onCropDone, onCancel, aspect = 16 / 9 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })
    onCropDone(file)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <h3 className="text-white font-semibold text-sm">Crop Image</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
          <FaTimes size={18} />
        </button>
      </div>

      {/* Cropper area */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-900 px-4 py-4 space-y-3">
        {/* Zoom slider */}
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <FaSearchMinus className="text-gray-400" size={14} />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <FaSearchPlus className="text-gray-400" size={14} />
          <span className="text-gray-400 text-xs w-10 text-right">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
          >
            <FaCrop size={14} />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  )
}
