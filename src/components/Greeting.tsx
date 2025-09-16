// src/components/Greeting.tsx

export function Greeting({ name }: { name?: string }) {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  }
  return <h1>Hello, World!</h1>;
}
