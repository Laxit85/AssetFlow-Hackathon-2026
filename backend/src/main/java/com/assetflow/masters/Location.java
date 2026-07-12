package com.assetflow.masters;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Location {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
