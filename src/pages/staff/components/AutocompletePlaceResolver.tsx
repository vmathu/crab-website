import { Autocomplete, AutocompleteChangeReason, TextField, createFilterOptions, debounce } from '@mui/material';
import React from 'react';

function formatLocationData(rawData: any[]) {
  const formattedData = [];

  for (const item of rawData) {
    formattedData.push({
      _id: item._id,
      address: item.address,
    });
  }

  return formattedData;
}

export interface LocationValueProps {
  _id?: string;
  address: string;
  inputValue?: string;
}

export interface Props {
  label?: string;
  value: LocationValueProps | null;
  onChange?: (
    event: React.SyntheticEvent<Element, Event>,
    value: string | LocationValueProps | null,
    reason: AutocompleteChangeReason,
  ) => void;
}

const filter = createFilterOptions<LocationValueProps>();

export default function AutocompletePlaceResolver({ label, value, onChange }: Props) {
  // const [destinationValue, setDestinationValue] =
  //   React.useState<LocationValueProps | null>(null);

  // prettier-ignore
  const [destinationData, setDestinationData] = 
    React.useState<LocationValueProps[]>([]);

  return (
    <Autocomplete
      value={value}
      onInputChange={async (_, newValue) => {
        if (newValue.length == 0) return;
        // Debounce function
        const debouncedFetch = debounce(async () => {
          const rawData = await fetch(`http://localhost:3000/api/location-records?address=${newValue}`).then((res) =>
            res.json(),
          );
          setDestinationData(formatLocationData(rawData.data.data));
        }, 500);

        // Call the debounced function
        await debouncedFetch();
      }}
      onChange={onChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.address);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            address: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={'autocomplete_' + label?.toLowerCase()}
      options={destinationData}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.address;
      }}
      renderOption={(props, option) => (
        <li key={option._id} {...props}>
          {option.address}
        </li>
      )}
      freeSolo
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
