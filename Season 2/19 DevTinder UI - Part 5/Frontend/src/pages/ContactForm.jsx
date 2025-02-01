import emailjs from "@emailjs/browser";
import { useState } from "react";
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validateInputs = () => {
    const newErrors = { name: "", email: "", message: "" };

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
      <div className="flex-2 m-10 flex justify-center rounded-lg bg-bgSecondary shadow-md shadow-shadow">
        <div className="min-w-[500px] p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold xl:text-5xl">Contact Us</h1>
            <p className="mt-1 text-textMuted">
              We'd love to hear from you. Send us a message!
            </p>
            <div className="mt-2 w-full flex-1">
              <form className="mx-auto max-w-md" onSubmit={handleSendMessage}>
                {errors.name && (
                  <p className="mb-1 text-center text-xs text-error">
                    {errors.name}
                  </p>
                )}
                <input
                  className="mb-3 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    console.log("Name Input:", e.target.value);
                  }}
                  style={{ color: "black", background: "white" }} // Debugging visibility issue
                />

                {errors.email && (
                  <p className="mb-1 text-center text-xs text-error">
                    {errors.email}
                  </p>
                )}
                <input
                  className="mb-3 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    console.log("Email Input:", e.target.value);
                  }}
                  style={{ color: "black", background: "white" }} // Debugging visibility issue
                />

                {errors.message && (
                  <p className="mb-1 text-center text-xs text-error">
                    {errors.message}
                  </p>
                )}
                <textarea
                  className="mb-3 w-full rounded-lg border-2 border-border px-8 py-4 font-medium text-black placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }));
                    console.log("Message Input:", e.target.value);
                  }}
                  style={{ color: "black", background: "white" }} // Debugging visibility issue
                />

                <button
                  className="focus:shadow-outline mt-3 flex w-full items-center justify-center rounded-lg bg-primary py-4 font-semibold tracking-wide text-text transition-all duration-300 ease-in-out hover:bg-hover focus:outline-none"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
