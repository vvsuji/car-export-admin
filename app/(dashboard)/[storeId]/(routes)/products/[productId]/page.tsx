import prismadb from '@/lib/prismadb';

import { ProductForm } from './components/product-form';

const ProductPage = async ({
	params,
}: {
	params: { productId: string; storeId: string };
}) => {
	const product = await prismadb.product.findUnique({
		where: {
			id: params.productId,
		},
		include: {
			images: true,
		},
	});

	const categories = await prismadb.category.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	const makes = await prismadb.make.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	const colors = await prismadb.color.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const conditions = await prismadb.condition.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const driveTypes = await prismadb.driveType.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const fuelTypes = await prismadb.fuelType.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const locations = await prismadb.location.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const models = await prismadb.model.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const options = await prismadb.option.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const passengers = await prismadb.passenger.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const steerings = await prismadb.steering.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const transmissions = await prismadb.transmission.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ProductForm
					categories={categories}
					colors={colors}
					makes={makes}
					conditions={conditions}
					driveTypes={driveTypes}
					fuelTypes={fuelTypes}
					locations={locations}
					models={models}
					options={options}
					passengers={passengers}
					steerings={steerings}
					transmissions={transmissions}
					initialData={product}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
