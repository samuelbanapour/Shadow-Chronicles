export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="font-display text-6xl text-blood/40">404</div>
        <p className="font-lore italic text-muted-foreground">This path leads nowhere. Even the darkness has edges.</p>
      </div>
    </div>
  );
}
