const Title = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className="flex flex-col gap-y-3 items-center">
      <p className="text-blue-950 text-5xl font-bold">{title}</p>
      <p className="w-[65%] text-center">{subTitle}</p>
    </div>
  );
};

export default Title;
