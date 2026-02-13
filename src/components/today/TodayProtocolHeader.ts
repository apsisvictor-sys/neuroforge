import { createElement } from "react";

type TodayProtocolHeaderProps = {
  title: string;
  slug: string;
};

export function TodayProtocolHeader({ title, slug }: TodayProtocolHeaderProps) {
  return createElement("p", null, `Protocol: ${title} (${slug})`);
}
