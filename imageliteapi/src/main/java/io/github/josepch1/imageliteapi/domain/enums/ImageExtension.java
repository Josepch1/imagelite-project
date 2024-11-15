package io.github.josepch1.imageliteapi.domain.enums;

import org.springframework.http.MediaType;

import lombok.Getter;

import java.util.Arrays;

public enum ImageExtension {
  PNG(MediaType.IMAGE_PNG),
  JPEG(MediaType.IMAGE_JPEG),
  GIF(MediaType.IMAGE_GIF);

  @Getter
  private MediaType mediaType;

  ImageExtension(MediaType imagePng) {
    this.mediaType = imagePng;
  }

  public static ImageExtension valueOf(MediaType mediaType) {
    return Arrays.stream(values()).filter(ie -> ie.mediaType.equals(mediaType))
                                                              .findFirst()
                                                              .orElse(null);
  }

  public static ImageExtension ofName(String name) {
    return Arrays.stream(values()).filter(ie -> ie.name().equalsIgnoreCase(name))
                                                          .findFirst()
                                                          .orElse(null);
  }
}
