import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface DropZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

export default function DropZone({ accept, multiple = false, onFiles, label = 'Drop files here or click to upload', hint }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function handle(incoming: File[]) {
    const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1);
    setFiles(next);
    onFiles(next);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handle(Array.from(e.dataTransfer.files));
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handle(Array.from(e.target.files));
  }

  function remove(i: number) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onFiles(next);
  }

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-sky-400 bg-sky-50' : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={onChange} />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium text-sm">{label}</p>
        {hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
              <span className="truncate text-gray-700 max-w-xs">{f.name}</span>
              <span className="text-gray-400 ml-4 flex-shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={(e) => { e.stopPropagation(); remove(i); }} className="ml-3 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
