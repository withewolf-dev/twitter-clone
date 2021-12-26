import Image from "next/image";
import React from "react";

interface Props {}

const SideBar = (props: Props) => {
  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30} />
      </div>
    </div>
  );
};

export default SideBar;
