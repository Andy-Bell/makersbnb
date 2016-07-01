```
{(user)
  User: ‘andrea’;
  Username: ‘andreamazza’;  — to be unique  
  Owned spaces: [space1, space2…];
  Requested spaces: [{<#space1>: dayString}, {<#space>2: dayString} …];
  Booked spaces: [{space: ‘space1’, date: ’date’}, …]; 
}

{(space)
  SpaceName: ‘space 1’ — to be unique ;
  Owner_id: user_id;
  SpaceDescription: ‘cosy cellar’;
  Price: 55;
  Schedule_id; shchedule_id;
}

{(schedule)
  Space: <#Space>;
  Available Dates: [dayString, dayString, dayString, dayString, dayString…];
  Requests: [{dayString: <#user>}, {dayString: <#user>}];
  Booked: [{dayString: <#user>}, {dayString: <#user>}];
}
```
