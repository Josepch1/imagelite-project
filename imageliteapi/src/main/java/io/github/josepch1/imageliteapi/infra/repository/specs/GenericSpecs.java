package io.github.josepch1.imageliteapi.infra.repository.specs;

import org.springframework.data.jpa.domain.Specification;

public class GenericSpecs {
  
  private GenericSpecs() {}

  public static <T> Specification<T> conjunction() {
    return (_, _, criteriaBuilder) -> criteriaBuilder.conjunction();
  }
}
