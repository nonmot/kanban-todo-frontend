import { type SubmitHandler, useForm } from "react-hook-form";
import type { Todo } from "@/app/types/todo";

type Props = {
	todos: Todo[];
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
	onCreate: (todo: Todo) => void;
};

type Inputs = {
	title: string;
};

export default function TodoForm(props: Props) {
	const { onCreate } = props;

	const { register, handleSubmit, formState } = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		const newTodo: Todo = {
			title: data.title,
			id: "hoge",
			status: "TODO",
			authorId: "hjoge",
			deadline: "hoge",
			createdAt: "hoge",
			updatedAt: "hoge",
			content: "",
		};
		onCreate(newTodo);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input
				type="text"
				className="border"
				{...register("title", { required: true, maxLength: 128 })}
			/>
			<button
				type="submit"
				className="bg-blue-500 text-white disabled:bg-gray-500"
				disabled={!formState.isValid}
			>
				作成
			</button>
		</form>
	);
}
