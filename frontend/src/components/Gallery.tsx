"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, ArrowRight, Images } from "lucide-react";
import Link from "next/link";
import { galleryApi, GalleryAlbum } from "@/lib/api";
import { useApiList } from "@/lib/hooks";

const FALLBACK_ALBUMS: GalleryAlbum[] = [];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: albums, loading } = useApiList(() => galleryApi.getAlbums(), FALLBACK_ALBUMS);

  // Ne rien afficher pendant le chargement ou s'il n'y a pas d'albums
  if (loading || albums.length === 0) return null;

  // Afficher les 4 derniers albums
  const latestAlbums = albums.slice(0, 4);

  return (
    <section id="gallery" className="py-14 lg:py-24 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Galerie Photos
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Revivez les moments forts de la 2ALHB en images
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestAlbums.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href="/galerie"
                className="block bg-white dark:bg-dark-bg rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="aspect-square bg-gradient-to-br from-green to-green-light flex items-center justify-center relative overflow-hidden">
                  {album.cover_image ? (
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Camera className="text-white/30" size={48} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <span className="flex items-center gap-1">
                      <Images size={12} />
                      {album.photos_count}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors text-sm line-clamp-1">
                    {album.title}
                  </h3>
                  {album.description && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-1">
                      {album.description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-medium hover:bg-green-dark transition-colors"
          >
            Voir toute la galerie <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
