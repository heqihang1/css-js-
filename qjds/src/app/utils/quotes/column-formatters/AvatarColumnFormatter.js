import React from "react";
import Avatar from "@material-ui/core/Avatar";

export const AvatarColumnFormatter = (cell, row) => {
  return cell ? (
    <Avatar
      src={cell}
      style={{ width: 30, height: 30 }}
      alt={row?.customer_id?.customer_officer_id?.displayname}
    />
  ) : (
    <Avatar style={{ width: 30, height: 30 }}>
      {String(row?.customer_id?.customer_officer_id?.displayname)[0].toLocaleUpperCase()}
    </Avatar>
  );
};
