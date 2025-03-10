import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import CustomIcon from "./customicon";

type Props = {
  icon: string;
  title: string;
  desc: string;
  items: string[];
  border?: boolean;
  action?: (selected: string) => void;
};

export default function HeroSectionItem({
  icon,
  title,
  desc,
  items,
  border = true,
  action,
}: Props) {
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  return (
    <Dropdown className="w-72 md:w-64 rounded-md ml-16 mt-2">
      <DropdownTrigger className="h-auto justify-start ">
        <Button
          variant="bordered"
          className={`outline-none w-full lg:w-52 py-2 md:py-0 px-5 md:px-0 md:border-b md:border-none ${
            border ? "border-b md:border-none pb-3 md:pb-0" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="px-3 py-3 rounded-full border flex items-center justify-center">
              <CustomIcon name={icon} size={24} color="black" />
            </div>
            <div className="flex flex-col gap-0 items-start">
              <p className="roboto">{title}</p>
              <p className="roboto text-lightText">{desc}</p>
            </div>
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        className="w-full bg-white outline-none rounded-md border my-0"
      >
        {items.map((element, index) => {
          if (!isValidDate(element)) {
            return (
              <DropdownItem
                key={element + "_" + index}
                className={`w-full ${
                  index !== items.length - 1 ? "border-b" : ""
                } roboto text-base py-4`}
                onPress={() => action && action(element)}
                value={element}
              >
                <p className="px-6">{element}</p>
              </DropdownItem>
            );
          }

          const formattedDate = new Intl.DateTimeFormat("sr-Latn-RS", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(element));

          return (
            <DropdownItem
              key={element + "_" + index}
              className={`w-full ${
                index !== items.length - 1 ? "border-b" : ""
              } roboto text-base py-4`}
              onPress={() => action && action(element)}
              value={element}
            >
              <p className="px-6">{formattedDate}</p>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
