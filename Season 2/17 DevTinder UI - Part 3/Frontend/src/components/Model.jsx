// eslint-disable-next-line react/prop-types
const Model = ({ children, isModelShow }) => {
  return (
    <>
      <div
        className={`bg-primary/20 fixed left-0 top-0 z-50 w-full overflow-y-auto bg-opacity-20 bg-clip-padding backdrop-blur-lg backdrop-filter ${isModelShow ? "" : "hidden"}`}
      >
        <div className="min-height-screen flex items-center justify-center px-4 pb-20 pt-4 text-center sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-bgSecondary opacity-75" />
          </div>
          <span className=" inline-block h-screen align-middle">
            &#8203;
          </span>
          <div
            className="align-center inline-block transform overflow-hidden rounded-lg border-2 border-border text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {children}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Model;
