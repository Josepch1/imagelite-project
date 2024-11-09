package io.github.josepch1.imageliteapi.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import io.github.josepch1.imageliteapi.domain.enums.ImageExtension;

@Entity
@Table
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column
  private String name;

  @Column
  private Long size;

  @Column
  @Enumerated(EnumType.STRING)
  private ImageExtension extension;

  @Column
  @CreatedDate
  private LocalDateTime uploadDate;

  @Column
  private String tags;

  @Column
  @Lob
  private byte[] file;


  public String getFileName() {
    return getName().concat(".").concat(getExtension().name());
  }
}
