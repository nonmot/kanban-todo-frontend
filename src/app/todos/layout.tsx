import Header from "@/components/Header";

export default async function TodosLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container mx-auto">
			<Header />
			{children}
		</div>
	);
}
