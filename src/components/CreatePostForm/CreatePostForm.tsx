import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";
import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import { Post } from "../../types/post";

interface FormValues {
  title: string;
  body: string;
}

const initialFormValues: FormValues = {
  title: '',
  body: '',
}

const PostFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content is too long")
    .required("Content is required"),
});

interface PostFormProps {
  onCancel: () => void;
} 

export default function PostForm({ onCancel }: PostFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Post, Error, FormValues>({
    mutationFn:(values) => createPost({...values, userId:1}),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onCancel();
    }
  })

  const handleSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        formikHelpers.resetForm();
      }
    })
  }

  return (
    <Formik initialValues={initialFormValues} onSubmit={handleSubmit} validationSchema={PostFormSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
