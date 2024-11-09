package io.github.josepch1.imageliteapi.infra.repository.specs;

import org.springframework.data.jpa.domain.Specification;

import io.github.josepch1.imageliteapi.domain.entity.Image;
import io.github.josepch1.imageliteapi.domain.enums.ImageExtension;

public class ImageSpecs {
  
  private ImageSpecs() {}

  public static Specification<Image> extensionEqual(ImageExtension extension) {
    return (root, _, cb) -> cb.equal(root.get("extension"), extension);
  }

  public static Specification<Image> nameLike(String name) {
    return (root, _, cb) -> cb.like(cb.upper(root.get("name")), "%" + name.toUpperCase() + "%");
  }

  public static Specification<Image> tagsLike(String tags) {
    return (root, _, cb) -> cb.like(cb.upper(root.get("tags")), "%" + tags.toUpperCase() + "%");
  }
}
