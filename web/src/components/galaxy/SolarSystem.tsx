"use client";

import { useCallback, useState } from "react";
import { PlanetModal } from "@/components/galaxy/PlanetModal";
import { getPlanet, ORBIT_PLANETS, type Planet } from "@/lib/planets";
import styles from "./solar-system.module.css";

export function SolarSystem() {
  const [open, setOpen] = useState<Planet | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <div className={styles.galaxy}>
      <div className={styles.title}>
        <h1 className="gradient-text">SPARKVERSE</h1>
        <p className={styles.subtitle}>The world map</p>
      </div>
      <div className={styles.solarSystem} role="group" aria-label="Sparkverse solar system">
        <div className={`${styles.orbit} ${styles.orbit1}`} />
        <div className={`${styles.orbit} ${styles.orbit2}`} />
        <div className={`${styles.orbit} ${styles.orbit3}`} />
        <div className={`${styles.orbit} ${styles.orbit4}`} />
        <button
          type="button"
          className={styles.sun}
          onClick={() => setOpen(getPlanet("core") ?? null)}
          aria-label="Open Core Spark"
        >
          <span className={styles.sunLabel}>
            CORE
            <br />
            SPARK
          </span>
        </button>
        {ORBIT_PLANETS.map((planet) => (
          <button
            key={planet.id}
            type="button"
            className={`${styles.planet} ${styles[planet.cssName as keyof typeof styles]}`}
            onClick={() => setOpen(planet)}
            aria-label={`Open ${planet.name}`}
          >
            <span className={styles.planetBody} />
            <span className={styles.planetInfo}>
              <span className={styles.planetName}>{planet.name}</span>
            </span>
          </button>
        ))}
      </div>
      <PlanetModal planet={open} onClose={close} />
    </div>
  );
}
