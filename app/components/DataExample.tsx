import React from "react";
import dataExamples from "../data/example.json";

type DataExampleEntry = {
  id: string;
  people: string[];
  lat: number;
  long: number;
  place?: string | null;
};

const dataExampleData = dataExamples as DataExampleEntry[];
const dataExamplesById = new Map(
  dataExampleData.map((entry) => [entry.id, entry]),
);

export default function DataExample({ id }: { id: string }) {
  const dataExample = dataExamplesById.get(id);
  if (!dataExample) return null;

  return (
    <dl>
      {dataExample.place && (
        <div role="group" data-label="place">
          <dt>Place</dt>
          <dd>{dataExample.place}</dd>
        </div>
      )}
      {dataExample.people && dataExample.people.length > 0 && (
        <div role="group" data-label="people">
          <dt>People</dt>
          {dataExample.people.map((name) => (
            <dd key={name}>{name}</dd>
          ))}
        </div>
      )}
      {dataExample.lat && dataExample.long && (
        <div role="group" data-label="coordinates">
          <dt>Coordinates</dt>
          <dd>{dataExample.lat}, {dataExample.long}</dd>
        </div>
      )}
    </dl>
  );
}
