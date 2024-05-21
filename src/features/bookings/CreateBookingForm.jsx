import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import { useCreateBooking } from "./useCreateBooking";
import { useEffect, useState } from "react";
import { useCabins } from "../cabins/useCabins";
import Textarea from "../../ui/Textarea";
import Checkbox from "../../ui/Checkbox";
// import { formatCurrency } from "../../utils/helpers";

function CreateBookingForm({ onCloseModal }) {
  const { cabins } = useCabins();
  const { isBooking, createBookings } = useCreateBooking();
  const [selectedCabin, setSelectedCabin] = useState("");
  const [cabinPrice, setCabinPrice] = useState(0);
  // const [cabinName, setCabinName] = useState("");
  const [cabinCapacity, setCabinCapacity] = useState(0);
  const [cabinDiscount, setCabinDiscount] = useState(0);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "",
    flag: "",
    id: "",
  });
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [paymentIncluded, setPaymentIncluded] = useState(false);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [numNights, setNumNights] = useState(0);
  const { register, handleSubmit, formState, reset, watch } = useForm();
  const { errors } = formState;

  // const status = "unconfirmed";
  const start = watch("startDate");
  const end = watch("endDate");
  const [startDate, setStartDate] = useState(watch("startDate"));
  const [endDate, setEndDate] = useState(watch("endDate"));
  const totalPrice = cabinPrice + extrasPrice - cabinDiscount;
  // const hasBreakfast = 20;
  // console.log("start date:", watch("startDate"), startDate);

  useEffect(() => {
    setStartDate(start);
  }, [start]);

  useEffect(() => {
    setEndDate(end);
  }, [end]);

  useEffect(
    function () {
      if (start && end) {
        const start = new Date(startDate);
        // setStartDate(start);
        const end = new Date(endDate);
        const timeDiff = end - start;
        // console.log("this is time diff", timeDiff);
        // setEndDate(end);
        const diffDays = timeDiff / (1000 * 3600 * 24);
        setNumNights(diffDays > 0 ? diffDays : 0);

        if (breakfastIncluded) {
          setExtrasPrice(20 * diffDays);
        } else {
          setExtrasPrice(0);
        }
        // setNumNights(10);
      } else {
        setNumNights(0);
      }
    },
    [startDate, endDate, end, start, breakfastIncluded]
  );

  function onError(errors) {}

  function handleChange(e) {
    const selectedCabinId = Number(e.target.value);
    setSelectedCabin(selectedCabinId);

    const cabinId = cabins.find((cabin) => cabin.id === selectedCabinId);
    if (cabinId) {
      // setCabinName(cabinId.name);
      // setCabinName(cabinId ? cabinId.name : "");
      setCabinPrice(cabinId ? cabinId.regularPrice : "");
      setCabinCapacity(cabinId ? cabinId.maxCapacity : "");
      setCabinDiscount(cabinId ? cabinId.discount : "");
    } else {
      // setCabinName("");
      setCabinPrice(0);
      setCabinCapacity(0);
      setCabinDiscount(0);
    }
  }

  function handleBreakfastChange(e) {
    const isChecked = e.target.checked;
    setBreakfastIncluded(isChecked);

    if (isChecked) {
      setExtrasPrice(20 * numNights);
    } else {
      setExtrasPrice(0);
    }
  }
  // console.log(selectedCabin);
  // console.log(typeof cabinPrice);

  useEffect(function () {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryData = data.map((country, idx) => ({
          id: idx,
          name: country.name.common,
          flag: country.flags.svg,
        }));
        // console.log(countryData);
        setCountries(countryData);
        // console.log("flags", flag);
      })
      .catch((error) => console.log("Error fetching data:", error));
  }, []);

  function handleCountryChange(e) {
    const countryId = e.target.value;
    const country = countries.find((c) => c.id == countryId);

    setSelectedCountry({
      id: countryId,
      name: country.name,
      flag: country.flag,
    });
  }

  function handlePaymentChange(e) {
    setPaymentIncluded(e.target.checked);
  }

  // console.log(selectedCountry);

  function onSubmit(data) {
    if (!selectedCabin) {
      console.error("Cabin is not selected");
      return;
    }

    const bookingData = {
      fullName: data.fullName,
      email: data.email,
      nationality: selectedCountry.name,
      nationalID: data.nationalID,
      startDate: data.startDate,
      endDate: data.endDate,
      cabinId: selectedCabin,
      cabin: cabins.find((cabin) => cabin.id === Number(selectedCabin)).name,
      cabinPrice: cabinPrice,
      totalPrice: totalPrice,
      numGuests: data.numGuests,
      numNights: numNights,
      observations: data.observations,
      hasBreakfast: breakfastIncluded,
      extrasPrice: extrasPrice,
      isPaid: paymentIncluded,
      countryFlag: selectedCountry.flag,
    };

    // console.log("Booking Data:", bookingData);

    createBookings(
      { createBookings: bookingData },
      {
        onSuccess: (data) => {
          console.log(createBookings);
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Guest Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="fullName"
          placeholder="John Doe"
          disabled={isBooking}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Guest Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          placeholder="example@gmail.com"
          disabled={isBooking}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>
      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Select
          id="nationality"
          value={selectedCountry.id}
          // key={countries.id}
          disabled={isBooking}
          onChange={(e) => handleCountryChange(e)}
          options={[
            { value: "", label: "Select your country" },
            ...countries.map((country) => ({
              label: country.name,
              value: country.id,
            })),
          ]}
        />
      </FormRow>
      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          id="nationalID"
          type="text"
          placeholder="345678920"
          disabled={isBooking}
          {...register("nationalID", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Cabin Name">
        <Select
          id="cabin"
          value={selectedCabin}
          key={selectedCabin.id}
          onChange={(e) => handleChange(e)}
          disabled={isBooking}
          options={[
            { value: "", label: "Select a cabin" },
            ...cabins.map((cabin) => ({
              label: cabin.name,
              value: cabin.id,
              // key: cabin.id,
            })),
          ]}
        />
      </FormRow>
      <FormRow label="Number of Guest" error={errors?.numGuests?.message}>
        <Input
          id="numGuests"
          type="number"
          placeholder="4"
          disabled={isBooking}
          {...register("numGuests", {
            required: "This field is required",
            min: { value: 1, message: "Guest should be at least 1" },
            validate: (value) =>
              value <= cabinCapacity ||
              "Number of guests cannot be greater than cabin capacity",
          })}
        />
      </FormRow>
      <FormRow label="Cabin Price" error={errors?.cabinPrice?.message}>
        <Input
          id="cabinPrice"
          type="number"
          value={cabinPrice || 0}
          disabled={true}
        />
      </FormRow>
      <FormRow label="Max Capacity" error={errors?.maxCapacity?.message}>
        <Input
          id="maxCapacity"
          type="number"
          value={cabinCapacity || 0}
          disabled={true}
        />
      </FormRow>
      <FormRow label="Cabin Discount" error={errors?.cabinDiscount?.message}>
        <Input
          id="cabinDiscount"
          type="number"
          value={cabinDiscount || 0}
          disabled={true}
        />
      </FormRow>

      {/* <p>Start date here : {startDate}</p> */}
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isBooking}
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>
      {/* {endDate}
      <p>Num Nights here : {numNights}</p> */}
      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isBooking}
          {...register("endDate", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Number of Nights" error={errors?.numNights?.message}>
        <Input
          type="number"
          id="numNights"
          disabled={true}
          value={numNights || 0}
        />
      </FormRow>
      <FormRow label="Breakfast" error={errors?.hasBreakfast?.message}>
        <Checkbox
          id="hasBreakfast"
          type="checkbox"
          checked={breakfastIncluded}
          onChange={handleBreakfastChange}
          disabled={isBooking}
        />
      </FormRow>
      <FormRow label="Extras Price" error={errors?.extrasPrice?.message}>
        <Input id="extrasPrice" value={extrasPrice} disabled={true} />
      </FormRow>
      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          id="totalPrice"
          type="number"
          value={totalPrice || 0}
          disabled={true}
        />
      </FormRow>
      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          type="text"
          id="observations"
          disabled={isBooking}
          defaultValue=""
          {...register("observations", {
            required: "This field is required",
            max: { value: 100, message: "Limit reached" },
          })}
        />
      </FormRow>
      <FormRow label="Payment" error={errors?.isPaid?.message}>
        <Checkbox
          id="isPaid"
          type="checkbox"
          checked={paymentIncluded}
          onChange={handlePaymentChange}
          disabled={isBooking}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          type="reset"
          variation="secondary"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isBooking}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
