import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBooking } from "../../services/apiBookings";
// import { createGuest } from "../../services/apiGuests";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBookings, isLoading: isBooking } = useMutation({
    mutationFn: async ({ createBookings }) => {
      const bookingData = {
        ...createBookings,
        guestId: createBookings.guestId,
        startDate: createBookings.startDate,
        endDate: createBookings.endDate,
        numNights: createBookings.numNights,
        numGuests: createBookings.numGuests,
        cabinPrice: createBookings.cabinPrice,
        totalPrice: createBookings.totalPrice,
        cabinId: createBookings.cabinId,
        status: createBookings.status,
        observations: createBookings.observations,
        hasBreakfast: createBookings.hasBreakfast,
        isPaid: createBookings.isPaid,
        extrasPrice: createBookings.extrasPrice,
        countryFlag: createBookings.countryFlag,
      };
      await createBooking(bookingData);
    },
    onSuccess: () => {
      toast.success("New booking successfully created");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createBookings, isBooking };
}
