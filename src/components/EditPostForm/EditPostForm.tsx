import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import css from "./EditPostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import { Post } from "../../types/post";
import toast from "react-hot-toast";

export interface FormValues {
  id: number;
  title: string;
  body: string;
}


const PostFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content is too long")
    .required("Content is required"),
})

interface EditPostFormProps {
  initialValues: FormValues;
  onCancel: () => void;
}

export default function EditPostForm({ initialValues, onCancel }: EditPostFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Post, Error,FormValues>({
    mutationFn: (values) => editPost(values.id, { title: values.title, body: values.body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post edited successfully!");
      onCancel();
    },
    onError: () => {
      toast.error("Failed to edit post. Please try again.")
    }
  });


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => mutation.mutate(values)}
      validationSchema={PostFormSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            {mutation.isPending ? "Editing..." : "Edit post"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
