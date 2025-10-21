interface TimetableElementProps {
  offset?: number;
  height?: number;
  children?: React.ReactNode;
}

export default function TimetableElement({
  offset,
  height,
  children,
}: TimetableElementProps) {
  return (
    <div
      style={{ top: offset, height: `calc(${height}px - 0.25rem)` }}
      className="absolute w-full overflow-hidden rounded-md"
    >
      {children}
    </div>
  );
}
