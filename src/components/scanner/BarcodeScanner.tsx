"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Scan, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onScan: (code: string) => void;
};

export default function BarcodeScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const controlsRef = useRef<IScannerControls | null>(null);

  const requestCameraPermission = async () => {
    try {
      setPermissionRequested(true);
      setError(null);
      
      // Solicitar permiso explícitamente
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Detener el stream de prueba
      stream.getTracks().forEach(track => track.stop());
      
      // Si llegamos aquí, tenemos permiso - iniciar scanner
      startScanner();
    } catch (err: any) {
      console.error("Permission error:", err);
      if (err.name === 'NotAllowedError') {
        setError("❌ Permiso denegado. Ve a Configuración > Privacidad > Cámara y activa el permiso para este navegador.");
      } else if (err.name === 'NotFoundError') {
        setError("❌ No se encontró ninguna cámara en tu dispositivo.");
      } else {
        setError(`❌ Error al acceder a la cámara: ${err.message}");
      }
    }
  };

  useEffect(() => {
    // No iniciar automáticamente, esperar a que el usuario lo solicite
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  async function startScanner() {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();

    try {
      setIsScanning(true);
      setError(null);

      const controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result, err) => {
          if (result) {
            const text = result.getText();
            setScanSuccess(true);
            setTimeout(() => {
              setIsScanning(false);
              onScan(text);
            }, 500);
          }
        }
      );
      
      controlsRef.current = controls;
      
      // Esperar a que el video esté listo
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err: any) {
      console.error("Scanner start error:", err);
      setError("❌ Error al iniciar el escáner. Intenta recargar la página.");
      setIsScanning(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!permissionRequested ? (
        <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-3xl border-2 border-white/30 bg-gradient-to-br from-cocorico-red/20 to-amber-500/20 backdrop-blur-md shadow-2xl min-h-[60vh]">
          <div className="bg-white/90 p-6 rounded-full shadow-xl">
            <Camera className="w-16 h-16 text-cocorico-red" />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">Acceso a la Cámara</h3>
            <p className="text-white/90 text-lg max-w-md">
              Para escanear códigos de barras, necesitamos acceder a tu cámara.
            </p>
            <p className="text-white/80 text-sm">
              Tu privacidad es importante. Solo accedemos a la cámara cuando escaneas.
            </p>
          </div>
          <Button
            onClick={requestCameraPermission}
            size="lg"
            className="bg-white text-cocorico-red hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-xl"
          >
            <Camera className="w-6 h-6 mr-2" />
            Permitir Acceso a la Cámara
          </Button>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border-2 border-white/30 bg-black/20 backdrop-blur-md shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-[60vh] object-cover"
          />
        
        controlsRef.current = controls;
        
        // Esperar a que el video esté listo
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }

        
        {/* Overlay de escaneo */}
        {isScanning && isCameraReady && !scanSuccess && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Marco de escaneo */}
            <div className="relative w-64 h-64 border-4 border-white/80 rounded-2xl shadow-xl">
              {/* Esquinas animadas */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cocorico-red rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cocorico-red rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cocorico-red rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cocorico-red rounded-br-2xl"></div>
              
              {/* Línea de escaneo animada */}
              <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-cocorico-red to-transparent animate-pulse"></div>
              
              {/* Icono de escaneo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full shadow-lg animate-pulse">
                  <Scan className="w-6 h-6 text-cocorico-red" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay de éxito */}
        {scanSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm pointer-events-none animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-full shadow-2xl">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
        )}
        
        {/* Overlay de carga de cámara */}
        {isScanning && !isCameraReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto"></div>
              <p className="text-white text-lg font-medium">Activando cámara...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Estado y mensajes */}
      <div className="text-center space-y-2">
        {isScanning && isCameraReady && !scanSuccess && (
          <div className="flex items-center justify-center gap-2 text-white">
            <Scan className="w-5 h-5 animate-pulse" />
            <p className="text-lg font-medium">Apunta la cámara al código de barras</p>
          </div>
        )}
        
        {!isScanning && !error && (
          <p className="text-white/80">Escaneo detenido. Recarga la página para volver a intentar.</p>
        )}
        
        {error && (
          <div className="flex items-center justify-center gap-2 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <p className="text-red-200 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
