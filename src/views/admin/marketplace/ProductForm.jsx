import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  HStack,
  Image,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [stock, setStock] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories once the component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://b-e-production.up.railway.app/api/v1/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Product name is required.";
    if (price <= 0) newErrors.price = "Price must be greater than zero.";
    if (stock < 0) newErrors.stock = "Stock cannot be negative.";
    if (!category) newErrors.category = "Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("discountPercent", discountPercent.toString());
    formData.append("description", description);
    formData.append("category", category);
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);
    if (image4) formData.append("image4", image4);
    if (image5) formData.append("image5", image5);
    formData.append("stock", stock.toString());
    if (tags.length > 0) formData.append("tags", JSON.stringify(tags));

    try {
      const response = await axios.post("https://b-e-production.up.railway.app/api/v1/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 || response.status === 200) {
        alert("Product added successfully!");
      } else {
        alert("Error occurred while adding product.");
      }
    } catch (error) {
      alert("An error occurred. Please check your input and try again.");
      console.error("Error adding product:", error);
    }
  };

  const columns = useBreakpointValue({ base: 1, md: 2 });

  return (
    <Box p={4} style={{ background: "#fff", borderRadius: 12 }}>
      <form onSubmit={handleSubmit}>
        <SimpleGrid spacing={4}>
          <FormControl id="name" isRequired isInvalid={errors.name}>
            <FormLabel>Product Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl id="price" isRequired isInvalid={errors.price}>
            <FormLabel>Price</FormLabel>
            <NumberInput value={price} onChange={(valueString) => setPrice(parseFloat(valueString))} precision={2} min={0}>
              <NumberInputField placeholder="Enter price" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.price}</FormErrorMessage>
          </FormControl>

          <FormControl id="discountPercent">
            <FormLabel>Discount Percentage</FormLabel>
            <NumberInput value={discountPercent} onChange={(valueString) => setDiscountPercent(parseFloat(valueString))} precision={2} min={0} max={100}>
              <NumberInputField placeholder="Enter discount percentage" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl id="category" isRequired isInvalid={errors.category}>
            <FormLabel>Category</FormLabel>
            <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((category, index) => (
                <option value={category._id} key={index}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.category}</FormErrorMessage>
          </FormControl>

          <FormControl id="stock" isRequired isInvalid={errors.stock}>
            <FormLabel>Stock</FormLabel>
            <NumberInput value={stock} onChange={(valueString) => setStock(parseInt(valueString, 10))} min={0}>
              <NumberInputField placeholder="Enter stock quantity" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.stock}</FormErrorMessage>
          </FormControl>

          {/* Image Upload Inputs */}
          {["image1", "image2", "image3", "image4", "image5"].map((imageKey, index) => {
            const image = eval(imageKey); // Dynamically access the image state
            const setImage = eval(`set${imageKey.charAt(0).toUpperCase() + imageKey.slice(1)}`); // Dynamically access the setImage function
            return (
              <FormControl key={index} id={imageKey}>
                <FormLabel>{`Image ${index + 1}`}</FormLabel>
                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage)} />
                {image && (
                  <Box mt={2}>
                    <Image src={image ? URL.createObjectURL(image) : ""} alt={`Image ${index + 1} Preview`} boxSize="100px" objectFit="cover" />
                  </Box>
                )}
              </FormControl>
            );
          })}

          {/* Description Field with React Quill */}
          <FormControl id="description" gridColumn="span 2">
            <FormLabel>Description</FormLabel>
            <ReactQuill value={description} onChange={setDescription} placeholder="Enter product description" />
          </FormControl>

          {/* Tags Section */}
          <FormControl id="tags" gridColumn="span 2">
            <FormLabel>Tags</FormLabel>
            <HStack>
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Enter a tag" />
              <IconButton icon={<AddIcon />} onClick={handleAddTag} aria-label="Add tag" />
            </HStack>
            <HStack mt={2} spacing={2}>
              {tags.map((tag) => (
                <Tag size="md" key={tag} borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Add Product
          </Button>
        </SimpleGrid>
      </form>
    </Box>
  );
};

export default ProductForm;
