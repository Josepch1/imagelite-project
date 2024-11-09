package io.github.josepch1.imageliteapi.infra.repository;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import io.github.josepch1.imageliteapi.domain.entity.Image;
import io.github.josepch1.imageliteapi.domain.enums.ImageExtension;

import static io.github.josepch1.imageliteapi.infra.repository.specs.ImageSpecs.*;
import static org.springframework.data.jpa.domain.Specification.*;
import static io.github.josepch1.imageliteapi.infra.repository.specs.GenericSpecs.*;

public interface ImageRepository extends JpaRepository<Image, String>, JpaSpecificationExecutor<Image> {
  
  default List<Image> findByExtensionAndNameOrTagsLike(ImageExtension extension, String query) {
    Specification<Image> spec = where(conjunction());

    if (extension != null) {
      spec = spec.and(extensionEqual(extension));
    }

    if(StringUtils.hasText(query)) {
      spec = spec.and(anyOf(nameLike(query), tagsLike(query)));
    }

    return findAll(spec);
  }
}
