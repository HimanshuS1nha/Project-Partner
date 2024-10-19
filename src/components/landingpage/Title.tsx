const Title = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className="flex flex-col gap-y-3 items-center">
      <p className="text-blue-950 text-4xl md:text-5xl font-bold text-center">{title}</p>
      <p className="w-[90%] md:w-[65%] text-center text-sm md:text-base">{subTitle}</p>
    </div>
  );
};

export default Title;
