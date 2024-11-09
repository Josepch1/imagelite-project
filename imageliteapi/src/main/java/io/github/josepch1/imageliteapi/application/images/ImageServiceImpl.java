package io.github.josepch1.imageliteapi.application.images;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.josepch1.imageliteapi.domain.entity.Image;
import io.github.josepch1.imageliteapi.domain.enums.ImageExtension;
import io.github.josepch1.imageliteapi.domain.service.ImageService;
import io.github.josepch1.imageliteapi.infra.repository.ImageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
  private final ImageRepository repository;

  @Override
  @Transactional
  public Image save(Image image) {
    return repository.save(image);
  }

  @Override
  public Optional<Image> findById(String id) {
    return repository.findById(id);    
  }

  @Override
  public List<Image> search(ImageExtension extension, String query) {
    return repository.findByExtensionAndNameOrTagsLike(extension, query);
  }
  
}
