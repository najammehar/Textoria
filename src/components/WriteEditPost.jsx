import React, {useState, useCallback, useEffect} from 'react'
import postService from '../Appwrite/Post'
import {RTE, Input, Button, Select} from './index'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Oval } from 'react-loader-spinner'

function WriteEditPost({post}) {
    const {register, handleSubmit, control, watch, setValue, getValues, formState: { errors }} = useForm(
        {
            defaultValues: {
                title: post?.title || '',
                slug: post?.slug || '',
                description: post?.description || '',
                content: post?.content || '',
                category: post?.category || '',
                status: post?.status || 'public',
                
            },
            mode: 'onBlur'
        }
    );
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [thumbnailError, setThumbnailError] = useState(null);

    const [charCounts, setCharCounts] = useState({
        title: post?.title?.length || 0,
        slug: post?.slug?.length || 0,
        description: post?.description?.length || 0,
    });

    const updateCharCount = (field, value) => {
        setCharCounts(prev => ({
            ...prev,
            [field]: value.length
        }));
    };

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (['title', 'slug', 'description'].includes(name)) {
                updateCharCount(name, value[name]);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);
    
    const [loading, setLoading] = useState(false); // Loading state
    const [successMessage, setSuccessMessage] = useState(null); // Success message state


    const onSubmit = async (data) => {
        setLoading(true); // Set loading to true when form is submitted
    
        if (!data.content) {
            setLoading(false);
            return;
        }
    
        if (!post && !data.image[0]) {
            setThumbnailError('Please choose a thumbnail');
            setLoading(false);
            return;
        }
    
        setThumbnailError(null);
    
        try {
            if (post) {
                const file = data.image[0] ? await postService.thumbnailUpload(data.image[0]) : null;
                if (file) {
                    await postService.deleteThumbnail(post.thumbnail);
                };
                const response = await postService.updatePost(
                    post.slug,
                    data.title,
                    data.category,
                    data.content,
                    file?.$id || post.thumbnail,
                    data.status,
                    data.description,
                );
    
                if (response) {
                    setSuccessMessage('Post updated successfully');
                    setTimeout(() => navigate(`/`), 2000);
                }
            } else {
                let file = null;
                try {
                    file = data.image[0] ? await postService.thumbnailUpload(data.image[0]) : null;
                } catch (error) {
                    console.error('File upload error:', error);
                }
    
                if (file) {
                    const fileId = file.$id;
                    data.thumbnail = fileId;
                    try {
                        const response = await postService.createPost(
                            data.slug,
                            {
                                userId: userData.$id,
                                title: data.title,
                                slug: data.slug,
                                category: data.category,
                                content: data.content,
                                thumbnail: fileId,
                                status: data.status,
                                description: data.description
                            }
                        );
    
                        if (response) {
                            setSuccessMessage('Post created successfully');
                            setTimeout(() => navigate(`/`), 2000);
                        }
                    } catch (error) {
                        console.error('Error creating post:', error);
                        if (error.message === 'A post with this slug already exists') {
                            setSlugError('This slug is already in use. Please choose a different one.');
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const [slugError, setSlugError] = useState(null);
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(post?.thumbnail ? `https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID_F_IMAGE}/files/${post.thumbnail}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}` : null);
    
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];

        setThumbnail(file);
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setThumbnailPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

  return (
    <form
    className='max-w-5xl mx-auto px-4 flex flex-col gap-4 my-4'
    onSubmit={handleSubmit(onSubmit)}>
      {loading && <p className="text-center text-blue-500">Loading...</p>}
        {successMessage && <p className="text-center text-green-500">{successMessage}</p>}
      <div className='relative'>
                <Input 
                    label='Title'
                    placeholder='Title'
                    className='block w-full pl-2 pr-20 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
                    {...register('title', {
                        required: 'Title is required',
                        maxLength: {
                            value: 100,
                            message: 'Title must be 100 characters or less'
                        },
                        onChange: (e) => updateCharCount('title', e.target.value)
                    })}
                />
                <p className="absolute bottom-[9px] right-3 text-gray-500 mt-1">{charCounts.title}/100</p>
            </div>
            {errors.title && errors.title.message && <p className="text-red-500 text-sm -mt-3">{errors.title.message}</p>}
            <div className='relative'>
                <Input 
                    label='Slug'
                    placeholder='Slug'
                    className='block w-full pl-2 pr-20 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
                    {...register('slug', {
                        required: 'Slug is required',
                        maxLength: {
                            value: 100,
                            message: 'Slug must be 100 characters or less'
                        },
                        onChange: (e) => updateCharCount('slug', e.target.value)
                    })}
                />
                <p className="absolute bottom-[9px] right-3 text-gray-500 mt-1">{charCounts.slug}/100</p>
            </div>
            {errors.slug && errors.slug.message && <p className="text-red-500 text-sm -mt-3">{errors.slug.message}</p>}
        {slugError && <p style={{color: 'red'}}>{slugError}</p>}
        <div className='relative'>
                <Input 
                    label='Description'
                    placeholder='Description'
                    className='block w-full pl-2 pr-20 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
                    {...register('description', {
                        required: 'Description is required',
                        maxLength: {
                            value: 200,
                            message: 'Description must be 200 characters or less'
                        },
                        onChange: (e) => updateCharCount('description', e.target.value)
                    })}
                />
                <p className="absolute bottom-[9px] right-3 text-gray-500 mt-1">{charCounts.description}/200</p>                
                </div>
                {errors.description && errors.description.message && <p className="text-red-500 text-sm -mt-3">{errors.description.message}</p>}

                <div className='relative'>
                <RTE 
                    label='Content'
                    name="content"
                    control={control}
                    defaultValue={getValues('content')}
                    rules={{
                        required: 'Content is required',
                    }}
                />
                {errors.content && <p className="text-red-500 text-sm -mt-3">{errors.content.message}</p>}
            </div>
            {thumbnailPreview &&
            <div className='max-w-2xl mx-auto rounded-md overflow-hidden'>
            <img className='w-full h-full rounded-md object-contain' src={thumbnailPreview} alt='post.title' />
            </div>
            }
        <label className='text-center cursor-pointer bg-purple-60 hover:bg-blue active:bg-purple-60 text-white py-2 px-4 rounded-md w-full block'>
        <Input 
            className='hidden'
            type='file'
            accept ='image/png, image/jpg, image/jpeg, image/gif'    
            {...register('image', {
                required: !post ? 'Thumbnail is required' : false,
                onChange: (e) => handleThumbnailChange(e)
            })}
        />
        <span>Choose Thumbnail</span>
        </label>
        {errors.image && <p className="text-red-500 text-sm -mt-3">{errors.image.message}</p>}
        {thumbnailError && <p className="text-red-500 text-sm -mt-3">{thumbnailError}</p>}
        <Select
            options = {['Technology', 'Lifestyle', 'Health and Wellness', 'Business and Finance', 'Entertainment', 'Education', 'Travel', 'Sports', 'Food', 'Fashion']}
            label='Category'
            className = 'block w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
            {...register('category', {required: 'Category is required'})}
        />
        {errors.category &&<p className="text-red-500 text-sm -mt-3">{errors.category.message}</p>}

        <Select
            options = {['Public', 'Private']}
            label='Status'
            className = 'block w-full px-2 py-2 rounded-md border border-gray-500 dark:bg-[#171717] bg-gray-100 text-black dark:text-white'
            {...register('status', {required: 'Category is required'})}
        />
        {errors.status &&<p className="text-red-500 text-sm -mt-3">{errors.status.message}</p>}

        <Button type='submit'
        disabled={loading}
        className='bg-purple-60 hover:bg-blue active:bg-purple-60 text-white py-2 px-2 rounded-md w-full block'
        >{loading ? (
            <div className='flex items-center justify-center'>
              <Oval
                visible={true}
                height="24"
                width="24"
                strokeWidth="4"
                color="white"
                secondaryColor='#d8d6fa'
                ariaLabel="oval-loading"
              />
            </div>
          ) : `${post ? 'Update' : 'Publish'}`}</Button>
        
    </form>
  )
}

export default WriteEditPost