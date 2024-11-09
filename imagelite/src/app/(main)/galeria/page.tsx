"use client";

import { useEffect, useState, useCallback } from "react";
import { useImageService } from "@/resources";
import { Image } from "@/resources/image/image.resource";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ImageCard from "./_components/ImageCard";


export default function Galeria() {
  const useService = useImageService;

  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchExtension, setSearchExtension] = useState("");

  const fetchImages = useCallback(async () => {
      try {
        const images = await useService.getImages(searchName, searchExtension);
        setImages(images);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }, [useService, searchName, searchExtension]);

  function renderImageCard(image: Image) {
    return (
      <ImageCard
        key={image.url}
        name={image.name}
        url={image.url}
        size={image.size}
        extension={image.extension}
        uploadDate={image.uploadDate}
      />
    );
  }

  function renderImageCards(images: Image[]) {
    return images.map((image) => renderImageCard(image));
  }

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <>
      <section className="flex items-center justify-start my-5">
        <div className="flex space-x-4 w-full">
          <input
            type="text"
            className="border px-3 py-2 rounded-lg text-gray-900"
            placeholder="Search by name or tags"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)} // Atualiza a pesquisa por nome
          />
          <select
            className="border px-4 py-2 rounded-lg text-gray-900"
            value={searchExtension}
            onChange={(e) => setSearchExtension(e.target.value)} // Atualiza a pesquisa por extensão
          >
            <option value="">All formats</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="gif">GIF</option>
          </select>

          <Button className="flex items-center h-auto bg-blue-500 hover:bg-blue-600" onClick={fetchImages}>
            <FaSearch />
            </Button>

          <Link href="/formulario" className="!ml-auto">
            <Button className="bg-green-500 hover:bg-green-600 h-full">
              <div className="flex items-center gap-1">
              <FaPlus /> 
              <span>Adicionar</span>
              </div>
            </Button>
          </Link>
        </div>
      </section>

      {loading && (
        <section className="flex justify-center items-center">
          <Spinner size="large" />
        </section>
      )}

      {error && (
        <section className="flex justify-center items-center">
          <p>Error: {error.message}</p>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5">
        {images && renderImageCards(images)}
      </section>
    </>
  );
}
