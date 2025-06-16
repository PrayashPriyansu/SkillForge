type Props = object;
function Loader({}: Props) {
  return (
    // Use min-h-screen instead of h-full to guarantee it takes full viewport height
    // and w-screen for full viewport width if not already contained by a full-width parent.
    // Or, if it's already within a main content div that spans the full width, w-full is fine.
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="relative h-32 w-32">
          <div
            className="border-b-primary border-muted border-r-primary absolute h-full w-full animate-spin rounded-full border-[3px]"
            style={{ animationDuration: '3s' }}
          ></div>

          <div
            className="border-t-primary absolute h-full w-full animate-spin rounded-full border-[3px] border-gray-100/10"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          ></div>
        </div>

        <div className="to-primary/5 from-primary/10 absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr via-transparent blur-sm"></div>
      </div>
    </div>
  );
}
export default Loader;
