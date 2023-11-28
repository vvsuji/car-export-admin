import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
	req: Request,
	{ params }: { params: { productId: string } },
) {
	try {
		if (!params.productId) {
			return new NextResponse('Product id is required', { status: 400 });
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				category: true,
				make: true,
				color: true,
				condition: true,
				driveType: true,
				engineVolume: true,
				fuelType: true,
				location: true,
				model: true,
				option: true,
				passenger: true,
				steering: true,
				transmission: true,
				year: true,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { productId: string; storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 });
		}

		if (!params.productId) {
			return new NextResponse('Product id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 405 });
		}

		const product = await prismadb.product.delete({
			where: {
				id: params.productId,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { productId: string; storeId: string } },
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			name,
			price,
			categoryId,
			images,
			colorId,
			makeId,
			yearId,
			conditionId,
			driveTypeId,
			engineVolumeId,
			fuelTypeId,
			locationId,
			modelId,
			optionId,
			passengerId,
			steeringId,
			transmissionId,
			isFeatured,
			isArchived,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 });
		}

		if (!params.productId) {
			return new NextResponse('Product id is required', { status: 400 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!images || !images.length) {
			return new NextResponse('Images are required', { status: 400 });
		}

		if (!price) {
			return new NextResponse('Price is required', { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', { status: 400 });
		}

		if (!colorId) {
			return new NextResponse('Color id is required', { status: 400 });
		}

		if (!makeId) {
			return new NextResponse('make id is required', { status: 400 });
		}

		if (!yearId) {
			return new NextResponse('Year id is required', { status: 400 });
		}

		if (!conditionId) {
			return new NextResponse('Condition id is required', { status: 400 });
		}

		if (!driveTypeId) {
			return new NextResponse('Drive Type id is required', { status: 400 });
		}

		if (!engineVolumeId) {
			return new NextResponse('Engine Volume id is required', { status: 400 });
		}

		if (!fuelTypeId) {
			return new NextResponse('Fuel Type id is required', { status: 400 });
		}

		if (!locationId) {
			return new NextResponse('Location id is required', { status: 400 });
		}

		if (!modelId) {
			return new NextResponse('Model id is required', { status: 400 });
		}

		if (!optionId) {
			return new NextResponse('Option id is required', { status: 400 });
		}

		if (!passengerId) {
			return new NextResponse('Passenger id is required', { status: 400 });
		}

		if (!steeringId) {
			return new NextResponse('Steering id is required', { status: 400 });
		}

		if (!transmissionId) {
			return new NextResponse('Transmission id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 405 });
		}

		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				categoryId,
				colorId,
				makeId,
				yearId,
				conditionId,
				driveTypeId,
				engineVolumeId,
				fuelTypeId,
				locationId,
				modelId,
				optionId,
				passengerId,
				steeringId,
				transmissionId,
				images: {
					deleteMany: {},
				},
				isFeatured,
				isArchived,
			},
		});

		const product = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};

// import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';

// import prismadb from '@/lib/prismadb';

// export async function GET(
// 	req: Request,
// 	{ params }: { params: { productId: string } },
// ) {
// 	try {
// 		if (!params.productId) {
// 			return new NextResponse('Product id is required', { status: 400 });
// 		}

// 		const product = await prismadb.product.findUnique({
// 			where: {
// 				id: params.productId,
// 			},
// 			include: {
// 				images: true,
// 				category: true,
// 				make: true,
// 				color: true,
// 			},
// 		});

// 		return NextResponse.json(product);
// 	} catch (error) {
// 		console.log('[PRODUCT_GET]', error);
// 		return new NextResponse('Internal error', { status: 500 });
// 	}
// }

// export async function DELETE(
// 	req: Request,
// 	{ params }: { params: { productId: string; storeId: string } },
// ) {
// 	try {
// 		const { userId } = auth();

// 		if (!userId) {
// 			return new NextResponse('Unauthenticated', { status: 403 });
// 		}

// 		if (!params.productId) {
// 			return new NextResponse('Product id is required', { status: 400 });
// 		}

// 		const storeByUserId = await prismadb.store.findFirst({
// 			where: {
// 				id: params.storeId,
// 				userId,
// 			},
// 		});

// 		if (!storeByUserId) {
// 			return new NextResponse('Unauthorized', { status: 405 });
// 		}

// 		const product = await prismadb.product.delete({
// 			where: {
// 				id: params.productId,
// 			},
// 		});

// 		return NextResponse.json(product);
// 	} catch (error) {
// 		console.log('[PRODUCT_DELETE]', error);
// 		return new NextResponse('Internal error', { status: 500 });
// 	}
// }

// export async function PATCH(
// 	req: Request,
// 	{ params }: { params: { productId: string; storeId: string } },
// ) {
// 	try {
// 		const { userId } = auth();

// 		const body = await req.json();

// 		const {
// 			name,
// 			price,
// 			categoryId,
// 			images,
// 			colorId,
// 			makeId,
// 			isFeatured,
// 			isArchived,
// 		} = body;

// 		if (!userId) {
// 			return new NextResponse('Unauthenticated', { status: 403 });
// 		}

// 		if (!params.productId) {
// 			return new NextResponse('Product id is required', { status: 400 });
// 		}

// 		if (!name) {
// 			return new NextResponse('Name is required', { status: 400 });
// 		}

// 		if (!images || !images.length) {
// 			return new NextResponse('Images are required', { status: 400 });
// 		}

// 		if (!price) {
// 			return new NextResponse('Price is required', { status: 400 });
// 		}

// 		if (!categoryId) {
// 			return new NextResponse('Category id is required', { status: 400 });
// 		}

// 		if (!colorId) {
// 			return new NextResponse('Color id is required', { status: 400 });
// 		}

// 		if (!makeId) {
// 			return new NextResponse('Make id is required', { status: 400 });
// 		}

// 		const storeByUserId = await prismadb.store.findFirst({
// 			where: {
// 				id: params.storeId,
// 				userId,
// 			},
// 		});

// 		if (!storeByUserId) {
// 			return new NextResponse('Unauthorized', { status: 405 });
// 		}

// 		await prismadb.product.update({
// 			where: {
// 				id: params.productId,
// 			},
// 			data: {
// 				name,
// 				price,
// 				categoryId,
// 				colorId,
// 				makeId,
// 				images: {
// 					deleteMany: {},
// 				},
// 				isFeatured,
// 				isArchived,
// 			},
// 		});

// 		const product = await prismadb.product.update({
// 			where: {
// 				id: params.productId,
// 			},
// 			data: {
// 				images: {
// 					createMany: {
// 						data: [...images.map((image: { url: string }) => image)],
// 					},
// 				},
// 			},
// 		});

// 		return NextResponse.json(product);
// 	} catch (error) {
// 		console.log('[PRODUCT_PATCH]', error);
// 		return new NextResponse('Internal error', { status: 500 });
// 	}
// }
