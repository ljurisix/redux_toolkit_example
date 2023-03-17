import React from "react";

import Card from "../../components/Card";

export default {
  title: "Components/Card",
  component: Card,
};

const Template = (args) => <Card {...args} />;

export const VerticalCard = Template.bind({});
VerticalCard.args = {
  direction: "column",
  spacing: 3,
  wrap: false,
};
