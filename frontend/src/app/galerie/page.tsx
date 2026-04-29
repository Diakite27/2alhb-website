"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import { galleryApi } from "@/lib/api";
import type { GalleryAlbum } from "@/lib/api";
import { useApiList } from "@/lib/hooks";

const FALLBACK_ALBUMS: GalleryAlbum[] = [];

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 30, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: { image: string; title: string; caption: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[currentIndex];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="max-w-5xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.image}
          alt={img.title || "Photo"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
        />
        {(img.title || img.caption) && (
          <div className="text-center mt-4">
            {img.title && <p className="text-white font-medium">{img.title}</p>}
            {img.caption && <p className="text-white/60 text-sm mt-1">{img.caption}</p>}
          </div>
        )}
        <p className="text-white/40 text-xs text-center mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </motion.div>
  );
}

export default function GaleriePage() {
  const { data: albums } = useApiList(() => galleryApi.getAlbums(), FALLBACK_ALBUMS);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [albumImages, setAlbumImages] = useState<{ image: string; title: string; caption: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openAlbum = async (albumId: number) => {
    try {
      const detail = await galleryApi.getAlbum(albumId);
      setAlbumImages(detail.images);
      setSelectedAlbum(albumId);
    } catch {
      // fallback
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumImages([]);
  };

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Galerie Photos"
          subtitle="Revivez les moments forts de la 2ALHB en images."
          breadcrumbs={[{ label: "Galerie", href: "/galerie" }]}
        />

        {selectedAlbum ? (
          /* Album detail view */
          <section className="py-12 bg-white dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={closeAlbum}
                className="flex items-center gap-2 text-orange font-medium mb-8 hover:gap-3 transition-all"
              >
                <ChevronLeft size={18} /> Retour aux albums
              </button>

              {albumImages.length === 0 ? (
                <div className="text-center py-20">
                  <Camera className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={48} />
                  <p className="text-gray-500 dark:text-gray-400">Cet album est vide pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {albumImages.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                      onClick={() => setLightboxIndex(i)}
                    >
                      <img
                        src={img.image}
                        alt={img.title || `Photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Albums grid */
          <section className="py-12 bg-white dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {albums.length === 0 ? (
                <div className="text-center py-20">
                  <Images className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={56} />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">La galerie est en cours de préparation</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Les photos seront bientôt disponibles.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album, i) => (
                    <AnimSection key={album.id} delay={i * 0.05}>
                      <button
                        onClick={() => openAlbum(album.id)}
                        className="w-full text-left bg-gray-50 dark:bg-dark-card rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
                      >
                        <div className="aspect-video bg-gradient-to-br from-green to-green-light flex items-center justify-center relative overflow-hidden">
                          {album.cover_image ? (
                            <img
                              src={album.cover_image}
                              alt={album.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Camera className="text-white/30" size={48} />
                          )}
                          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {album.photos_count} photos
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors">
                            {album.title}
                          </h3>
                          {album.description && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                              {album.description}
                            </p>
                          )}
                        </div>
                      </button>
                    </AnimSection>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && albumImages.length > 0 && (
          <Lightbox
            images={albumImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((lightboxIndex - 1 + albumImages.length) % albumImages.length)}
            onNext={() => setLightboxIndex((lightboxIndex + 1) % albumImages.length)}
          />
        )}
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </>
  );
}
